import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { Debt, DebtSchema } from 'src/schemas/debt.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Debt.name, schema: DebtSchema }])],
  controllers: [DebtsController],
  providers: [DebtsService],
})
export class DebtsModule {}
