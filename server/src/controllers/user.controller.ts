import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '@services/user.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '@dto/create-user.dto';
import { UserResponseDto } from '@dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(userData);
  }

  @Get()
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
