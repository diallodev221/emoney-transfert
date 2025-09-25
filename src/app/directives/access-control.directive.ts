import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[accessControl]',
})
export class AccessControlDirective implements OnInit, OnDestroy {
  private _roles: string[] = [];
  private hasView = false;

  @Input('accessControl') set accessControl(roles: string | string[]) {
    if (Array.isArray(roles)) {
      this._roles = roles;
    } else if (typeof roles === 'string') {
      // Allow comma-separated string or single role
      this._roles = roles.split(',').map(r => r.trim()).filter(r => !!r);
    } else {
      this._roles = [];
    }
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // No observable user$ in AuthService, so just update view on init
    this.updateView();
  }

  ngOnDestroy() {
    // No subscriptions to clean up
  }

  private updateView() {
    const currentUser = this.auth.getCurrentUser?.();
    const userRole = currentUser?.profile?.name;

    // If no roles specified, show the element by default
    if (!this._roles.length) {
      this.show();
      return;
    }
    console.log("roles: ", this._roles)
    // Check if userRole is in allowed roles (case-insensitive)
    if (userRole && this._roles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
      this.show();
    } else {
      this.hide();
    }
  }

  private show() {
    if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }

  private hide() {
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
