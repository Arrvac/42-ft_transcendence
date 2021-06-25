import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateMatchHistoryDto } from '../match-histories/dto/create-match-history.dto';

import { User } from '../users/entities/user.entity';
import { MatchHistory } from '../match-histories/entities/match-history.entity';

async function reset_db() {
    await MatchHistory.delete({});
    await User.delete({});
}

export async function seed() {


    const usrDto1 = new CreateUserDto();
    usrDto1.login = "User1Login";
    usrDto1.nickname = "User1Nickname";
    usrDto1.wins = 0;
    usrDto1.looses = 0;
    usrDto1.current_status = "none";
    let u1 = await User.create(usrDto1).save();

    //await reset_db();
    const matchHisoryDto1 = new CreateMatchHistoryDto();
    matchHisoryDto1.score = "3-2";
    matchHisoryDto1.winner = u1;
    matchHisoryDto1.looser = u1;
    let matchHistory1 = await MatchHistory.create(matchHisoryDto1).save();

    const usrDto2 = new CreateUserDto();
    usrDto2.login = "User2Login";
    usrDto2.nickname = "User2Nickname";
    usrDto2.wins = 0;
    usrDto2.looses = 0;
    usrDto2.current_status = "none";
    usrDto2.match_histories = [matchHistory1];

    let u2 = await User.create(usrDto2).save();

    console.log(u1.friends + " login: " + u1.login);
    console.log(u2.friends + " login: " + u2.login);

    //await User.update(u1, { friends: [{id: u1.id}] });
    console.log("AFTER");

    u1 = await User.findOne({ id: u1.id });
    u1.friends = [u2];
    await User.save(u1);

    console.log(u1.friends[0].login + " login: " + u1.login);
    console.log(u2.friends + " login: " + u2.login);

    const matchHisoryDto2 = new CreateMatchHistoryDto();
    matchHisoryDto2.score = "3-2";
    matchHisoryDto2.winner = u1;
    matchHisoryDto2.looser = u2;

    let matchHistory2 = await MatchHistory.create(matchHisoryDto2).save();


    u1 = await User.findOne({ login: "nveron" });
    u1.match_histories = [matchHistory1, matchHistory2];
    await User.save(u1);

    console.log("MATCH HISTORY:")
    console.log(matchHistory1);
    console.log(u1.match_histories[0]);
    console.log(u1.match_histories[1]);
    console.log("=============================================");
    //await reset_db();
}
