import { Injectable } from "@nestjs/common";
import { RegistryService } from "../registry.service";
import { UsersRefData } from "./users-ref-data";

@Injectable()
export class UsersSeed {
  private static readonly COUNT_OF_USERS = 1337;

  constructor(private readonly registryService: RegistryService) {
  }

  async seed() {
    for (let i = 0; i < UsersSeed.COUNT_OF_USERS; i += 1) {
      const taxId = new Array(10).fill(0).map(() => Math.round(Math.random() * 9)).join("");
      const passport = new Array(9).fill(0).map(() => Math.round(Math.random() * 9)).join("");
      const phone = "+380" + new Array(9).fill(0).map(() => Math.round(Math.random() * 9)).join("");

      await this.registryService.create({
        first_name: UsersRefData.firstNames[Math.floor(Math.random() * UsersRefData.firstNames.length)],
        last_name: UsersRefData.lastNames[Math.floor(Math.random() * UsersRefData.lastNames.length)],
        middle_name: UsersRefData.firstNames[Math.floor(Math.random() * UsersRefData.firstNames.length)] + "ovych",
        address: UsersRefData.addresses[Math.floor(Math.random() * UsersRefData.addresses.length)],
        birthday: UsersRefData.DOBs[Math.floor(Math.random() * UsersRefData.DOBs.length)],
        phone,
        passport,
        tax_id: taxId
      });

      console.log(`${ i + 1 }/${ UsersSeed.COUNT_OF_USERS }`, "users created");
    }
  }
}
