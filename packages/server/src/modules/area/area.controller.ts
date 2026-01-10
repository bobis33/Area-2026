import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from '@dto/area.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('areas')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('actions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all available actions' })
  @ApiResponse({ status: 200, description: 'List of actions' })
  getActions() {
    return this.areaService.getAllActions();
  }

  @Get('reactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all available reactions' })
  @ApiResponse({ status: 200, description: 'List of reactions' })
  getReactions() {
    return this.areaService.getAllReactions();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new area' })
  @ApiResponse({ status: 201, description: 'The area has been created.' })
  @ApiBody({ type: CreateAreaDto })
  create(@Body() dto: CreateAreaDto) {
    return this.areaService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({ status: 200, description: 'List of areas' })
  getAll() {
    return this.areaService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get area by ID' })
  @ApiResponse({ status: 200, description: 'The area details' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.getById(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete area by ID' })
  @ApiResponse({ status: 200, description: 'The area has been deleted.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.delete(id);
  }

  @Put(':id/activate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate or deactivate an area' })
  @ApiResponse({
    status: 200,
    description: 'The area activation status has been updated.',
  })
  activate(
    @Param('id', ParseIntPipe) id: number,
    @Query('active', ParseBoolPipe) active: boolean,
  ) {
    return this.areaService.activate(id, active);
  }

  @Put(':id/rename')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rename an area' })
  @ApiResponse({ status: 200, description: 'The area has been renamed.' })
  rename(
    @Param('id', ParseIntPipe) id: number,
    @Param('new_name') newName: string,
  ) {
    return this.areaService.rename(id, newName);
  }
}
