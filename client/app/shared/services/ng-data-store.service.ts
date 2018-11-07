import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgDataStoreService {
  public ngUrls: string[] = [];
  public ngWords: string[] = [];
  public ngDomains: string[] = [];
}
