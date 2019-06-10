import * as cdk from '@aws-cdk/cdk'
import * as ec2 from '@aws-cdk/aws-ec2'

interface ExportOutput {
  vpc: ec2.Vpc
}

export class VPCStack extends cdk.Stack {
  protected deployEnv: string
  exportOutput: ExportOutput
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    this.deployEnv = this.node.getContext('env')
    const vpc = this.vpc()

    this.exportOutput = {
      vpc: vpc
    }
  }

  private vpc() {
    let cidr: string | null
    if (this.deployEnv === 'stg') {
      cidr = '172.32.1.0/24'
    } else if (this.deployEnv === 'prd') {
      cidr = '172.32.2.0/24'
    } else {
      throw new Error(`unknown env ${this.deployEnv}`)
    }
    return new ec2.Vpc(this, `${this.deployEnv}-vpc`, {
      cidr: cidr,
      maxAZs: 2,
      subnetConfiguration: [
        {
          cidrMask: 26,
          subnetType: ec2.SubnetType.Public,
          name: `${this.deployEnv}-vpc-public`
        },
        {
          cidrMask: 26,
          subnetType: ec2.SubnetType.Private,
          name: `${this.deployEnv}-vpc-private`
        }
      ]
    })
  }
}
