import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2')

export class VPCStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        [
            { name: 'testvpc', cidr: '172.32.1.0/24' }
        ].forEach(v =>
            new ec2.VpcNetwork(this, v.name, {
                cidr: v.cidr,
                maxAZs: 2,
                subnetConfiguration: [
                    {
                        cidrMask: 26,
                        subnetType: ec2.SubnetType.Public,
                        name: `${v.name}-public`
                    },
                    {
                        cidrMask: 26,
                        subnetType: ec2.SubnetType.Private,
                        name: `${v.name}-private`
                    }
                ]
            })
        )
    }
}
