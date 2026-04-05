import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { PlannedPaymentsService } from './planned-payments.service';
import { CreatePlannedPaymentDto } from './dto/create-planned-payment.dto';
import { UpdatePlannedPaymentDto } from './dto/update-planned-payment.dto';
import { PayPlannedPaymentDto } from './dto/pay-planned-payment.dto';

@Controller('planned-payments')
export class PlannedPaymentsController {
  constructor(private readonly plannedPaymentsService: PlannedPaymentsService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.plannedPaymentsService.findAll(req.user.authId, status, category, upcoming);
  }

  @Get('upcoming')
  findUpcoming(@Req() req) {
    return this.plannedPaymentsService.findAll(req.user.authId, undefined, undefined, 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.plannedPaymentsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreatePlannedPaymentDto) {
    return this.plannedPaymentsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlannedPaymentDto, @Req() req) {
    return this.plannedPaymentsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.plannedPaymentsService.remove(id, req.user.authId);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string, @Body() dto: PayPlannedPaymentDto, @Req() req) {
    return this.plannedPaymentsService.pay(id, dto, req.user.authId);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string, @Req() req) {
    return this.plannedPaymentsService.pause(id, req.user.authId);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string, @Req() req) {
    return this.plannedPaymentsService.resume(id, req.user.authId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Req() req) {
    return this.plannedPaymentsService.cancel(id, req.user.authId);
  }
}
