export interface IPaginacaoLog {
  codigo: number | string;
  pageIndex: number;
  totalRegistros: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
