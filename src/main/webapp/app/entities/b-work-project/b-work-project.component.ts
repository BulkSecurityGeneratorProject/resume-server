import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { BWorkProject } from './b-work-project.model';
import { BWorkProjectService } from './b-work-project.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-b-work-project',
    templateUrl: './b-work-project.component.html'
})
export class BWorkProjectComponent implements OnInit, OnDestroy {
bWorkProjects: BWorkProject[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private bWorkProjectService: BWorkProjectService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.bWorkProjectService.query().subscribe(
            (res: ResponseWrapper) => {
                this.bWorkProjects = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBWorkProjects();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BWorkProject) {
        return item.id;
    }
    registerChangeInBWorkProjects() {
        this.eventSubscriber = this.eventManager.subscribe('bWorkProjectListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
