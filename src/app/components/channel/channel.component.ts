import { Component, model, input, OnInit } from '@angular/core';
import { PowerControllerService } from '../../services/powercontroller-service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent{

  channelNo = model.required<number>();
  channelName = model<string>();
  channelEnabled = model.required<boolean>();
  buttonColor = input<string>();
  controllerId  = input.required<number>();

  constructor(private powerControllerService: PowerControllerService ) {
    console.log('Channel component initializing.');
  }


  updateChannel(){
    console.log("Updating channel: " + "Controller ID: "+this.controllerId() + ", Channel No. " + this.channelNo() + ", Channel Name:" + this.channelName() + ", New State: " + this.channelEnabled());
    this.powerControllerService.setChannelState(this.controllerId(), this.channelNo(), !this.channelEnabled()).pipe(
      catchError( err => {
        console.error(` - Error updating channel state on server:`, err);
        return of({ success: false, state: this.channelEnabled(), error: err.message });
      })
    ).subscribe( response => {
      console.log(` - Server response:`, response);
      if(response.success && response.error == null){
        this.channelEnabled.set(!this.channelEnabled());
        console.info(` - Channel state updated successfully on server: Controller ID ${this.controllerId()}, Channel No ${this.channelNo()}, State: ${this.channelEnabled()}`);
        //this.powerControllerService.updateControllerChannelState(this.controllerId(), this.channelNo(), this.channelEnabled());
        return of({ success: true, state: this.channelEnabled(), error: null });
      } else {
        console.warn(` - Failed to update channel state on server: Controller ID ${this.controllerId()}, Channel No ${this.channelNo()}`);
        return of({ success: false, state: this.channelEnabled(), error: response.error });
      }
    });;
  }

  toggleChannel() {
    console.log("Attempting to Toggle: " + "Controller ID: "+this.controllerId() + ", Channel No. " + this.channelNo() + ", Channel Name:" + this.channelName());
    if (this.controllerId() == null || this.channelNo() == null) {
     console.error('ControllerId or channelNo missing; reverting state ');
      return;
    }
    this.updateChannel()
  }

  turnOn() {
    this.channelEnabled.set(true);
  }

  turnOff() {
    this.channelEnabled.set(false);
  }

}
