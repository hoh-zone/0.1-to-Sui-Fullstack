import { ConnectButton } from '@mysten/dapp-kit';
import { Button, Flex, message, Modal, Spin, Table } from 'antd'
import { useEffect, useState } from 'react'
import { CreateUserBtn } from '../components/CreateUserBtn'
import { GetUserDetailApi, GetUsersApi } from '../apis/user.api';
import { useNetworkVariable } from '../utils/networkConfig'
import { User, UserDetail } from '../apis/types/user.type';
import { PageInfo } from '../apis/types/common.type';

export function HomePage() {
  const [messageApi, contextHolder] = message.useMessage()
  const packageId = useNetworkVariable('packageId')
  const [tableLoading, setTableLoading] = useState(false)
  const [dataSource, setDataSource] = useState<User[]>([])
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const columns = [
    {
      title: 'owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'profile_id',
      dataIndex: 'profile_id',
      key: 'profile_id',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: User) => (
        <Button type="link" onClick={() => seeDetail(record.profile_id)}>查看详情</Button>
      ),
    },
  ]

  /**
   * 获取用户
   */
  const getUsers = async (page: number | null = null) => {
    setTableLoading(true)
    let startCursor = pageInfo?.startCursor || null
    let endCursor = pageInfo?.endCursor || null
    switch (page) {
      case 0:
        startCursor = null
        break
      case 1:
        endCursor = null
        break
      default:
        startCursor = null
        endCursor = null
        break
    }
    const res = await GetUsersApi(packageId, endCursor, startCursor)
    setPageInfo(res?.pageInfo as PageInfo)
    const users = res?.nodes.map((node) => {
      if (node.contents && typeof node.contents === 'object' && 'json' in node.contents) {
        const user = node.contents.json as User
        return user
      }
      return null
    }).filter((user) => user !== null)
    setDataSource(users || [])
    setTableLoading(false)
  }

  /**
   * 查看详情
   * @param profileId 用户 ID
   */
  const seeDetail = async (profileId: string) => {
    setDetailLoading(true)
    setDetail(null)
    setDetailVisible(true)
    const detail = await GetUserDetailApi(profileId)
    if (detail) {
      setDetail(detail)
      
    } else {
      setDetail(null)
      messageApi.error('获取用户详情失败')
    }
    setDetailLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>
      {contextHolder}
      <header>
        <Flex gap="middle" align="center" vertical>
          <ConnectButton />
        </Flex>
      </header>
      <Flex justify="end">
        <CreateUserBtn onSuccess={() => getUsers()} />
      </Flex>
      <Table loading={tableLoading} pagination={false} rowKey="profile_id" dataSource={dataSource} columns={columns} />
      {
        tableLoading ?
        '' :
        <Flex justify="center" gap="middle">
          <Button disabled={!pageInfo?.hasPreviousPage} type="link" onClick={() => getUsers(0)}>上一页</Button>
          <Button disabled={!pageInfo?.hasNextPage} type="link" onClick={() => getUsers(1)}>下一页</Button>
        </Flex>
      }

      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {detailLoading ? <Spin /> : (
        <div>
          <p>名称：{detail?.name}</p>
            <p>描述：{detail?.description}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
