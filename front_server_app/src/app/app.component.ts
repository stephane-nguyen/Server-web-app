import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from './enum/data.state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  //readonly: dont need to use it in this class, we can use the var in component.html
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  //use to show UI (spinner...)
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        //data from back
        this.dataSubject.next(response);
        //instead of just response in data, we want to get the new servers added on the top of the list
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: {servers: response.data.servers.reverse()}} };
      }),
      //the return refers to http request => take some time => meanwhile display LOADING_STATE
      //appdata: null => remove it, optional
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        //error: error <=> error in js
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response) => {
        const index = this.dataSubject.value.data.servers.findIndex(
          (server) => server.id === response.data.server.id
        );
        this.dataSubject.value.data.servers[index] = response.data.server;
        this.filterSubject.next(''); //stop the spinner
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value) //latest data in dataSubject.value
      .pipe(
        map((response) => {
          return {
            dataState: DataState.LOADED_STATE,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  //return obj we save
  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
      .pipe(
        map((response) => {
          //add on top the new server, before all servers
          this.dataSubject.next(
            {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] } }
          );
          document.getElementById('closeModal').click();
          this.isLoading.next(false);
          serverForm.resetForm({ status: this.Status.SERVER_DOWN });
          return {
            dataState: DataState.LOADED_STATE,
            appData: this.dataSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  deleteServer(server: Server): void {

    this.appState$ = this.serverService.delete$(server.id).pipe(
      map((response) => {
        this.dataSubject.next(
          { ...response, data:
            //remove elt from array if condition met
            { servers: this.dataSubject.value.data.servers.filter(serv => serv.id !== server.id)}}
        );
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  printReport(): void {
    //pdf format
    // window.print();

    //excel file
    let DataType= 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml=tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink=document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + DataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls'
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
