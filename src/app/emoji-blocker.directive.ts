import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEmojiBlocker]'
})
export class EmojiBlockerDirective {

  // private regex = /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F680}-\u{1F6FF}]/gu;

  // private regex = /([\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1F680}-\u{1F6FF}])/gu;
  // private regex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F000}-\u{1F02F}]/gu;

  // private regex = /[\u{1F600}-\u{1F64F}\\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{25A0}-\u{25FF}\u{2B50}-\u{2B55}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{23E9}-\u{23EF}\u{23F0}-\u{23FF}\u{2190}-\u{21FF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{20E3}]/gu;

  private regex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{25A0}-\u{25FF}\u{2B50}-\u{2B55}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{23E9}-\u{23EF}\u{23F0}-\u{23FF}\u{2190}-\u{21FF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{20E3}](?![\d])/gu;

  constructor(private el:ElementRef) { }

  @HostListener('input',['$event']) onInputChange(event:InputEvent){
    const input=this.el.nativeElement.value;
    this.el.nativeElement.value=input.replace(this.regex,'')


   if (input !== this.el.nativeElement.value) {
    event.stopPropagation();
  }
  }

}
