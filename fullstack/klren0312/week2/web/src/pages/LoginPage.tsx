import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Transaction } from '@mysten/sui/transactions'
import { useNetworkVariable } from '../utils/networkConfig'
import { ConnectButton, useConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { GetCurrentUserProfileApi } from '../apis/user.api'
import { useEffect, useState } from 'react'

interface LoginFormData {
  username: string
  description: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const server = useNetworkVariable('server')
  const packageId = useNetworkVariable('packageId')
  const [loading, setLoading] = useState(false)
  const { mutate } = useSignAndExecuteTransaction()
  const client = useSuiClient()
  const account = useCurrentAccount()

  const getUserProfile = async () => {
    if (!account?.address) {
      return
    }
    const profile = await GetCurrentUserProfileApi(`${packageId}::week_two::Profile`, account?.address || '')
    if (profile) {
      navigate('/home')
    }
  }

  const onFinish = (values: LoginFormData) => {
    // 这里处理登录逻辑
    console.log('登录表单数据:', values)
    setLoading(true)
    const txb = new Transaction()
    txb.moveCall({
      target: `${packageId}::week_two::create_profile`,
      arguments: [
        txb.pure.string(values.username),
        txb.pure.string(values.description),
        txb.object(server),
      ],
    })
    mutate(
      {
        transaction: txb,
      },
      {
        onSuccess: async (result) => {
          await client.waitForTransaction({ digest: result.digest })
          form.resetFields()
          getUserProfile()
          messageApi.success('创建用户成功')
        },
        onError: (error) => {
          setLoading(false)
          console.error(error)
          messageApi.error('创建用户失败')
        },
      }
    )
  }

  useEffect(() => {
    getUserProfile()
  }, [account?.address])

  return (
    <div className="min-h-screen pt-10 flex flex-col justify-center items-center box-border bg-gray-50">
      {contextHolder}
      <ConnectButton />
      <div className="h-full w-full flex items-center justify-center">
        <Card title="用户注册" className="w-[80%] max-w-md shadow-xl rounded-lg border-0">
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                placeholder="用户名" 
                size="large"
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[{ required: true, message: '请输入描述!' }]}
            >
              <Input.TextArea 
                rows={4}
                placeholder="描述" 
                size="large"
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                loading={loading}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
