import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannedPaymentsController } from './planned-payments.controller';
import { PlannedPaymentsService } from './planned-payments.service';
import { PlannedPayment, PlannedPaymentSchema } from 'src/schemas/planned-payment.schema';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlannedPayment.name, schema: PlannedPaymentSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PlannedPaymentsController],
  providers: [PlannedPaymentsService],
})
export class PlannedPaymentsModule {}
