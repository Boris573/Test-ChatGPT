import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAIApi from 'openai';
import { Message } from './message.schema';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class MessageService {
  public openai: OpenAIApi;

  constructor(@InjectModel('Message') private messageModel: Model<Message>) {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async createMessage(prompt: string, response: string): Promise<Message> {
    const newMessage = new this.messageModel({
      prompt,
      response,
      createdAt: new Date(),
    });
    return newMessage.save();
  }

  private getMessageHistory(messages: Message[]): ChatCompletionMessageParam[] {
    return messages.flatMap((msg) => [
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response },
    ]);
  }

  async getResponse(prompt: string, messages: Message[]): Promise<string> {
    const history = this.getMessageHistory(messages);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...history,
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message?.content || '';
  }
}
