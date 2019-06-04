import cdk = require('@aws-cdk/cdk');

interface ImportValue {
    privateSubnetIds: string[]
}

export class SomeAppStack extends cdk.Stack {
    protected deployEnv: string
    private importValue: ImportValue
    constructor(scope: cdk.Construct, id: string, importValue: ImportValue, props?: cdk.StackProps) {
        super(scope, id, props);
        this.deployEnv = this.node.getContext('env')
        this.importValue = importValue
        console.log(this.importValue)
    }
}
