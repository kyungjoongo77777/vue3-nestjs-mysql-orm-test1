import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    healthCheck(): string {
        return "Server health is 18 leejackie and kyungjoon is genius";
    }
}
