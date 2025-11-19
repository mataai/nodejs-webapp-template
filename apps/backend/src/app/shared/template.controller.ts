import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { MapInterceptor } from '@automapper/nestjs';

import { User } from '@webapp-template/database';

import { RequestUser } from '../core/decorators/user.decorator';
import { AuthGuard } from '../features/auth/authentication';

class MODEL {}
class MODELDTO {}
class MODELCreateRequestDTO {}
class MODELUpdateRequestDTO {}

@ApiTags('TODO')
@Controller('TODO')
export class TemplateController {
  @Get()
  @ApiAcceptedResponse()
  @UseInterceptors(MapInterceptor(MODEL, MODELDTO, { isArray: true }))
  public query(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('where') where: string,
    @Query('orderBy') orderBy: string
  ): Promise<MODEL[]> {
    console.log(skip, take, where, orderBy);
    throw new Error('Method not implemented.');
  }

  @Get(':id')
  @ApiAcceptedResponse()
  @UseInterceptors(MapInterceptor(MODEL, MODELDTO))
  public get(@Param('id') id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  @Post()
  @ApiAcceptedResponse({ type: MODELDTO })
  @UseGuards(AuthGuard)
  @UseInterceptors(MapInterceptor(MODEL, MODELDTO))
  public create(
    @Body() body: MODELCreateRequestDTO,
    @RequestUser() author: User
  ) {
    console.log(body, author);
    throw new Error('Method not implemented.');
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: MODELDTO })
  @UseInterceptors(MapInterceptor(MODEL, MODELDTO))
  public update(
    @Param('id') id: string,
    @Body() body: MODELUpdateRequestDTO,
    @RequestUser() author: User
  ) {
    console.log(id, body, author);
    throw new Error('Method not implemented.');
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: MODELDTO })
  public delete(@Param('id') id: string, @RequestUser() author: User) {
    console.log(id, author);
    throw new Error('Method not implemented.');
  }
}
