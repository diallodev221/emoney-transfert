import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private url: string = ''

    private http = inject(HttpClient);

    recuperListUtilisateurs() {
        return this.http.get(this.url)
    }
}