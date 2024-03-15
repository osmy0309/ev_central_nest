import { Controller } from '@nestjs/common';
import {
  Delete,
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/rol/decorator/rol.decorator';
import {
  createTrasactionDto,
  deleteTrasactionDto,
  filterTrasactionDto,
} from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get('changeBD')
  async UpdateBD() {
    return await this.transactionService.updateBD();
  }

  @Get('removeConnectors')
  async removeConnectors() {
    return await this.transactionService.removeConnectors();
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post('new_transaction')
  async newTransaction(@Body() newTrasaction: createTrasactionDto) {
    return await this.transactionService.newTransaction(newTrasaction);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post('change_state_transaction')
  async changeStatenewTransaction(@Body() newTrasaction: createTrasactionDto) {
    return await this.transactionService.changeStatenewTransaction(
      newTrasaction,
    );
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Post('transaction_filter')
  async filterTransaction(@Body() filterTrasaction: filterTrasactionDto) {
    return await this.transactionService.filterTransaction(filterTrasaction);
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Delete('delete_transaction_relations')
  @ApiBody({
    description:
      'En este caso puedes pasar tanto el id de un cargador o de una tarjeta, o ambos para eliminar la transacción entre ellos. En caso de colocar un solo id de cuaquiera de los dos casos se eliminan todas las transacciones existentes de ese Cargador/Tarjeta. Esto es en caso de eliminar algun cargador o tarjeta eliminar todas las transacciones existentes.',
    type: deleteTrasactionDto,
  })
  @ApiResponse({
    status: 200,
    description: JSON.stringify({ success: true }),
    type: Object,
  })
  async deleteRelationTransaction(@Body() newTransaction: deleteTrasactionDto) {
    return await this.transactionService.deleteRelationTrasaction(
      newTransaction,
    );
  }
}
