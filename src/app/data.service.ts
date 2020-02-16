import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { throwError, Observable, of} from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  private usersApiUrl = "http://localhost:3000/users";

  constructor(private httpClient: HttpClient) { }
  //GET USERS
  public sendGetUsersRequest() {
    return this.httpClient.get(this.usersApiUrl).pipe(retry(3), catchError(this.handleError));
  }
  //GET FIRST 4 USERS
  public sendGetFirstFourUsersRequest() {
    // Add safe, URL encoded _page and _limit parameters 
    return this.httpClient.get<User>(this.usersApiUrl, { params: new HttpParams({ fromString: "_page=1&_limit=4" }), observe: "response" }).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }
  //GET FROM URL
  public sendGetRequestToUrl(url: string) {
    return this.httpClient.get<User>(url, { observe: "response" }).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));

    }));
  }
  //ERROR HANDLING
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  parseLinkHeader(header) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(',');
    var links = {};
    parts.forEach(p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first = links["first"];
    this.last = links["last"];
    this.prev = links["prev"];
    this.next = links["next"];
  }
  //SIMPLE CRUD FUNCTIONS
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.usersApiUrl}`)
      .pipe(
        tap(Users => console.log('fetched Users')),
        catchError(this.handleCrudError('getUsers', []))
      );
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.usersApiUrl}/${id}`;
    return this.httpClient.get<User>(url).pipe(
      tap(_ => console.log(`fetched Users id=${id}`)),
      catchError(this.handleCrudError<User>(`getUsersById id=${id}`))
    );
  }

  addUser(Users: User): Observable<User> {
    return this.httpClient.post<User>(this.usersApiUrl, Users, httpOptions).pipe(
      tap((u: User) => console.log(`added Users w/ id=${u.id}`)),
      catchError(this.handleCrudError<User>('addUsers'))
    );
  }

  updateUser(id: number, Users: User): Observable<any> {
    const url = `${this.usersApiUrl}/${id}`;
    return this.httpClient.put(url, Users, httpOptions).pipe(
      tap(_ => console.log(`updated Users id=${id}`)),
      catchError(this.handleCrudError<any>('updateUsers'))
    );
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.usersApiUrl}/${id}`;
    return this.httpClient.delete<User>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Users id=${id}`)),
      catchError(this.handleCrudError<User>('deleteUsers'))
    );
  }


  public upload(formData) {
    return this.httpClient.post<any>(this.usersApiUrl, formData, {  
        reportProgress: true,  
        observe: 'events'  
      });
    }
  //GENERAL ERROR HANDLING FOR THE CRUD FUNCTIONS
  handleCrudError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
