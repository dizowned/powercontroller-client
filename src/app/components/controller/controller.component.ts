import {
  Component,
  model,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChannelComponent } from '../channel/channel.component';
import { MatListModule } from '@angular/material/list';
import { PowerController } from '../../models/powercontroller';
import { PowerControllerService } from '../../services/powercontroller-service';
import { channel } from '../../models/channel';
@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    ChannelComponent,
  ],
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Controller implements OnInit, OnChanges {
  controller = model<PowerController>();
  channels = [] as channel[];
  powercontrollerService: PowerControllerService;

  constructor(
    private cdr: ChangeDetectorRef,
    powercontrollerService: PowerControllerService,
  ) {
    this.powercontrollerService = powercontrollerService;
    if (this.controller() != null && this.controller()!.channels != null)
      this.channels = this.controller()!.channels;
    console.log('Controller component initializing.');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['controller']) {
      if (this.controller() != null && this.controller()!.channels != null)
        this.channels = this.controller()!.channels;
      this.cdr.detectChanges();
      console.log('Controller component detected changes in controller input:', this.controller());
    }
  }

  ngOnInit(): void {
    if (this.controller()) {
      console.log('Controller initializing: ' + this.controller()!.name);
    } else {
      console.log('Controller component OnInit - No controller data provided.');
    }
  }

  toggleAllOn() {
    console.log('Toggling all channels on:' + this.controller()!.name);
    if (this.channels != null) {
      for (let index = 0; index < this.channels.length; index++) {
        console.log('Toggling on channel number ' + this.channels[index].number);
        if (this.channels[index].state != true) {
          this.powercontrollerService
            .setChannelState(this.controller()!.id, this.channels[index].number, true)
            .subscribe({
              next: (ChannelUpdate) => {
                console.log('Channel Update: ' + ChannelUpdate.success);
                this.channels[index].state = true;
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error(
                  'Error toggling channel ' + this.channels[index].number + ' on:',
                  error,
                );
              },
            });
        }
      }
    }
  }

  toggleAllOff() {
    console.log(
      'Toggling all channels off: ' + this.controller()!.name + ' with ID ' + this.controller()!.id,
    );
    if (this.channels != null) {
      for (let index = 0; index < this.channels?.length; index++) {
        console.log('Toggling off channel number ' + this.channels[index].number);
        if (this.channels[index].state != false) {
        this.powercontrollerService
          .setChannelState(this.controller()!.id, this.channels[index].number, false)
          .subscribe({
            next: (ChannelUpdate) => {
              console.log('Channel Update: ' + ChannelUpdate.success);
              this.channels[index].state = false;
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error(
                'Error toggling channel ' + this.channels[index].number + ' off:',
                error,
              );
            },
          });
        }
      }
      console.log('All channels toggled off.');
    }
  }
}
