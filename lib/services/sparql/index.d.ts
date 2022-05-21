declare class Sparql {
    constructor();
    extractSubject(entity: string): Promise<{}>;
    genSparqlQueryString(intent: string, entity: any): string;
    queryOntology(intent: string, entity: {}): Promise<{}>;
}
export default Sparql;
