import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getAllMessages() {
    try {
      const messages = await this.messageService.getAllMessages();
      return messages;
    } catch (err) {
      console.error('Error fetching messages:', err);
      throw new HttpException(
        'Failed to fetch messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async sendMessage(@Body() body: { prompt: string }) {
    try {
      const { prompt } = body;

      const messages = await this.messageService.getAllMessages();
      const responseData = await this.messageService.getResponse(
        prompt,
        messages,
      );

      await this.messageService.createMessage(prompt, responseData);

      return {
        response: responseData,
      };
    } catch (err) {
      console.error('Error processing message:', err);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error: Answer not received',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
