import { Component, OnInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chamado } from 'src/app/models/chamados';
import { ChamadoService } from 'src/app/services/chamado.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  ELEMENT_DATA: Chamado[] = []
  FILTERED_DATA: Chamado[] = []

  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'dataAbertura', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: ChamadoService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA) //or resposta
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  retornaStatus(status: any): string {
    if (status == '0') {
      return 'ABERTO';
    }

    if (status == '1') {
      return 'EM ANDAMENTO';
    }

    return 'ENCERRADO';
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == '0') {
      return 'BAIXA';
    }

    if (prioridade == '1') {
      return 'MÉDIA';
    }

    return 'ALTA';
  }

  orderByStatus(status: any): void {
    let list: Chamado[] = []
    this.ELEMENT_DATA.forEach(element => {
        if(element.status == status)
        list.push(element)
    });
    this.FILTERED_DATA = list;
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA) //or list
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

}
