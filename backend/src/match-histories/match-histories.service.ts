import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';

@Injectable()
export class MatchHistoriesService {
	create(createMatchHistoryDto: CreateMatchHistoryDto) {
		return 'This action adds a new matchHistory';
	}

	findAll() {
		return `This action returns all matchHistories`;
	}

	findUserHistory(id: string) {
		return `This action returns User #${id}'s math history`;
	}

	findOne(id: number) {
		return `This action returns a #${id} matchHistory`;
	}

	update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto) {
		return `This action updates a #${id} matchHistory`;
	}

	remove(id: number) {
		return `This action removes a #${id} matchHistory`;
	}
}