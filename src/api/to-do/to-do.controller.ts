import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateToDoDto } from './dto/create.to-do.dto';
import { ToDo } from './to-do.entity';
import { ToDoService } from './to-do.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('to-do')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('to-do')
export class ToDosController {
  constructor(private readonly todoService: ToDoService) {}

  @Post()
  create(@Request() req, @Body() createToDoDto: CreateToDoDto): Promise<ToDo> {
    return this.todoService.create(createToDoDto, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createToDoDto: CreateToDoDto,
    @Request() req,
  ): Promise<ToDo> {
    return this.todoService.update(id, createToDoDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req): Promise<ToDo[]> {
    return this.todoService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ToDo> {
    return this.todoService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(id);
  }
}
