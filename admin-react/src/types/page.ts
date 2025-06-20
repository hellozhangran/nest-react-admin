export interface DateParams {
	beginTime?: string;
	endTime?: string;
}

export interface Pagination extends DateParams {
	pageNum?: number;
	pageSize?: number;
	orderByColumn?: string;
	isAsc?: string;
}
