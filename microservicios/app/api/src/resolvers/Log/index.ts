import { Resolver, Query, Arg, Subscription, Root, Args } from "type-graphql";

import { Log } from '../../models/Log'
import {  Between } from "typeorm";

@Resolver()
export class LogResolver {
  @Query(() => [Log])
  async logs(
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number,
    @Arg("timeStart", { nullable: true }) timeStart: number,
    @Arg("timeEnd", { nullable: true }) timeEnd: number): Promise<Log[]> {
    let logs: Log[];
    let count: number;
    if (offset && limit) {
      logs = await Log.find({ where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
      count = logs.length
      logs = logs.slice(offset, offset + limit + 1)
    }
    else {
      logs = await Log.find({ where: { unixStartTime: Between(timeStart || Date.now() - 604800000, timeEnd || Date.now())} , order: { unixStartTime: "DESC" } })
      count = logs.length
    }
      return logs
  }

  @Subscription({ topics: "NEW_LOG" })
  logsSubscription(
    @Root() log: Log,
  ): Log {
    return log;
  }
}