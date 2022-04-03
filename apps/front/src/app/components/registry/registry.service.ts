import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUser } from "@thesis/api-interfaces";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class RegistryService {
  private readonly baseURL = environment.apiURL;

  constructor(private readonly httpClient: HttpClient) {
  }

  createUser(data: Pick<IUser, "first_name" | "last_name" | "middle_name" | "birthday" | "phone" | "tax_id" | "passport" | "address">): Observable<IUser> {
    return this.httpClient.post<IUser>(`${ this.baseURL }/registry`, data);
  }

  getAllUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(`${ this.baseURL }/registry`);
  }

  deleteById(userIds: string[]): Observable<IUser[]> {
    return this.httpClient.delete<IUser[]>(`${ this.baseURL }/registry/delete`, {
      body: {
        userIds
      }
    });
  }

  updateById(userId: string, newData: Pick<IUser, "first_name" | "last_name" | "middle_name" | "phone" | "passport" | "address">): Observable<IUser> {
    return this.httpClient.patch<IUser>(`${ this.baseURL }/registry/${ userId }`, newData);
  }
}
