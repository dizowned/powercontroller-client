import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { PowerController, PowerControllerList } from "../models/powercontroller";
import { error } from 'node:console';
@Injectable({
  providedIn: 'root'
})
export class PowerControllerService {

  public servicename: string = 'PowerControllerService';

  private savedControllerList$!: Observable<PowerController[]>;
  private savedControllerJSON = 'assets/json/controller-list.json'

  private serverControllerList$!: Observable<PowerController[]>;
  private serverControllerUrl = 'http://localhost:3000/controllers'

  private allControllersList$!: Observable<PowerController[]>;

  private storedControllers: PowerController[] = [];

  constructor(private http: HttpClient) {
    console.log(this.servicename + " - Initializing...");

    console.log(this.servicename + " - Fetching any controllers from local JSON:", this.savedControllerJSON);
    this.savedControllerList$ = this.http.get<PowerController[]>(this.savedControllerJSON).pipe(
      catchError(error => {
        console.error(this.servicename + " - Failed to fetch from local JSON:", error);
        return of([]); // Return empty array on error
      })
    );
    this.savedControllerList$.subscribe(data => {
      console.log(this.servicename + " - Fetched controllers from local JSON:", data);
      data.forEach(controller => {
        this.storedControllers.push({id: controller.id, name: controller.name, url: controller.url, channels: (controller.channels ? controller.channels : []) });
        console.log(this.servicename + " - Loaded controller from local JSON:", controller);
      });
    });

    console.log(this.servicename + " - Fetching any controllers from local Server:", this.serverControllerUrl);
    this.serverControllerList$ = this.http.get<PowerController[]>(this.serverControllerUrl).pipe(
      catchError(error => {
        console.error(this.servicename + " - Failed to fetch from server:", error);
        return of([]); // Return empty array on error
      })
    );

    this.serverControllerList$.subscribe(data => {
      console.log(this.servicename + " - Fetched controllers from Server:", data);
      data.forEach(controller => {
        this.storedControllers.push({id: controller.id, name: controller.name, url: controller.url, channels: (controller.channels ? controller.channels : []) });
        console.log(this.servicename + " - Loaded controller from Server:", controller);
      });
    }
  );

    localStorage.setItem("ControllerList", JSON.stringify(this.storedControllers));
    console.log(this.servicename + " - Data in Local Storage after fetches:", this.storedControllers);

    this.allControllersList$ = combineLatest<[PowerController[], PowerController[]]>([this.savedControllerList$, this.serverControllerList$]).pipe(
      map(([savedControllers, serverControllers]) => {
        // Ensure arrays are defined (defensive check)
        const saved = savedControllers || [];
        const server = serverControllers || [];
        const controllers = [...saved, ...server];
        console.log(this.servicename + " - Combined controller list:", controllers);
        return controllers;
      })
    );

  }

  public addNewController(newData: PowerController){
    console.log("Updating controller List:", this.storedControllers);
    this.storedControllers.push({id: newData.id, name: newData.name, url: newData.url, channels: (newData.channels ? newData.channels : [])});
    localStorage.setItem("ControllerList", JSON.stringify(this.storedControllers));
    console.log(this.servicename + " - New controller added:", newData);
  }

  public getSavedControllers(): Observable<PowerController []>{
    console.log(this.servicename + " - Returning Controllers from JSON:", this.savedControllerList$);
    console.log(this.servicename + " - Returning Controllers from Server:", this.serverControllerList$);
    return this.allControllersList$;
  }

  /**
   * Creates the request to set the channel state on server for a given controller and channel number
   * Assumes server route: POST /setchannelstate/:controllerId/:channelNo/:state
   * Body: { }
   */
  public setChannelState(controllerId: number, channelNo: number, state: boolean): Observable<{ success: boolean; state: boolean; error: string }> {
    const url = `http://localhost:3000/setchannelstate/${controllerId}/${channelNo}/${state}`;
    console.log(this.servicename + ` - Setting state: ${url}`);
    return this.http.post<{ success: boolean; state: boolean; error: string }>(url, {})
  }

}
