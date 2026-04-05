import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('isArchived') isArchived?: string,
    @Query('accountType') accountType?: string,
  ) {
    return this.accountsService.findAll(req.user.authId, isArchived, accountType);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.accountsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto, @Req() req) {
    return this.accountsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.accountsService.remove(id, req.user.authId);
  }
}
