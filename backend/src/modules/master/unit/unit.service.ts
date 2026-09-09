import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUnitDto: CreateUnitDto) {
    return 'This action adds a new unit';
  }

  async findAll() {
    const unit = await this.prisma.unit.findMany({
      include: {
        conversionsFrom: true,
        conversionsTo: true,
      },
    });

    return { data: unit };
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  remove(id: number) {
    return `This action removes a #${id} unit`;
  }
}
