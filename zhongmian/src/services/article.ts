import { ApiService } from '../services';

class ArticleService {
    public getArticle(id: number): Promise<any> {
        let params = {
            id
        };
        return ApiService.get('/articles/{id}', params);
    }

    public getArticleWithCode(code: string): Promise<any> {
        let params = {
            code
        };
        return ApiService.get('/articles/withCode/{code}', params);
    }
}

export default new ArticleService();
