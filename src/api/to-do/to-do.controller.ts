import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IToDo } from './to-do.interface';
import { ToDoService } from './to-do.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateToDoDto } from '../to-do/dto/create.to-do.dto';

@ApiTags('to-do')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('to-do')
export class ToDoController {
  @Inject(ToDoService)
  private readonly service: ToDoService;

  @Get()
  findAll(): Promise<IToDo[]> {
    return this.service.findAll();
  }

  @Get(':id')
  public getToDo(@Param('id', ParseIntPipe) id: number) {
    return this.service.getToDo(id);
  }

  @Post()
  public createToDo(@Request() req, @Body() createToDoDto: CreateToDoDto) {
    return this.service.createToDo(createToDoDto, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createToDoDto: CreateToDoDto,
    @Request() req,
  ): Promise<IToDo> {
    return this.service.update(id, createToDoDto, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
