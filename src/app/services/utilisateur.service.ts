import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../models/user.interface";


@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private url: string = 'http://localhost:9090/api/utilisateurs'

    private http = inject(HttpClient);

    recuperListUtilisateurs() {
        return this.http.get<User[]>(this.url)
    }
}