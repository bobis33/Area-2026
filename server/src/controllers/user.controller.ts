import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';
import { UsersService } from '@services/user.service';
import { User as UserModel } from '@prisma/client';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '@dto/create-user.dto';
import { UserResponseDto } from '@dto/user-response.dto';

@ApiTags('Users')
@Controller()
export class UserController {
    constructor(
        private readonly userService: UsersService,
    ) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, type: UserResponseDto })
    async signupUser(
        @Body() userData: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.createUser(userData);
    }
}
