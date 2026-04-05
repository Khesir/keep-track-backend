import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';

@Controller('buckets')
export class BucketsController {
  constructor(private readonly bucketsService: BucketsService) {}

  @Get()
  findAll(@Req() req, @Query('isArchive') isArchive?: string) {
    return this.bucketsService.findAll(req.user.authId, isArchive);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.bucketsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateBucketDto) {
    return this.bucketsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBucketDto, @Req() req) {
    return this.bucketsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.bucketsService.remove(id, req.user.authId);
  }
}
