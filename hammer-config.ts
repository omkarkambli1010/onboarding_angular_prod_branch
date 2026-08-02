// hammer-config.ts
import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  override overrides = <any> {
    // Override the default settings
    'pinch': { enable: true },
    'rotate': { enable: true },
    'swipe': { direction: Hammer.DIRECTION_ALL }
    // Add more gestures if needed
  };
}
