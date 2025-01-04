import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { Button, Modal, Input, Form, message, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNetworkVariable } from '../utils/networkConfig'
import { GetCurrentUserProfileApi } from '../apis/user.api'
import { UserDetail } from '../apis/types/user.type'

export function CreateUserBtn({ onSuccess }: { onSuccess: () => void }) {
  const client = useSuiClient()
  const [profile, setProfile] = useState<UserDetail | null>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const packageId = useNetworkVariable('packageId')
  const server = useNetworkVariable('server')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }
  const { mutate } = useSignAndExecuteTransaction()
  const account = useCurrentAccount()
  const getUserProfile = async () => {
    if (!account?.address) {
      return
    }
    const profile = await GetCurrentUserProfileApi(packageId, account?.address || '')
    setProfile(profile)
  }
  const openModal = () => {
    form.resetFields()
    setOpen(true)
  }
  const onOk = () => {
    setLoading(true)
    const txb = new Transaction()
    txb.moveCall({
      target: `${packageId}::week_one::create_profile`,
      arguments: [
        txb.pure.string(form.getFieldsValue().name),
        txb.pure.string(form.getFieldsValue().description),
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
          setOpen(false)
          form.resetFields()
          getUserProfile()
          onSuccess()
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
    <>
      {contextHolder}
      {profile ? <Tag color="blue">当前用户：{profile.name}</Tag> : <Button onClick={openModal}>创建用户</Button>}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        width={600}
        title="创建用户"
        confirmLoading={loading}
      >
        <Form {...layout} form={form} onFinish={onOk}>
          <Form.Item label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}