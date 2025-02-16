import { Button, message, Modal, Card, Form, Input, InputNumber, Select, Table } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { GetCurrentUserProfileApi } from '../apis/user.api'
import { useNetworkVariable } from '../utils/networkConfig'
import { UserDetail } from '../apis/types/user.type'
import { useNavigate } from 'react-router-dom'
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { FolderData } from '../apis/types/folder.type'
import { GetFolderCoinListApi, GetFolderListApi } from '../apis/folder.api'

interface CoinInfo {
  symbol: string
  coinObjectCount: number
  humanBalance: number
  coinType: string
  name: string
}

export function HomePage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const packageId = useNetworkVariable('packageId')
  const [profile, setProfile] = useState<UserDetail | null>(null)
  const [folderModalVisible, setFolderModalVisible] = useState(false)
  const [folderForm] = Form.useForm()
  const [folderLoading, setFolderLoading] = useState(false)
  const account = useCurrentAccount()
  const client = useSuiClient()
  const { mutate } = useSignAndExecuteTransaction()
  const currentFolderId = useRef<string | null>(null)
  const [saveCoinModalVisible, setSaveCoinModalVisible] = useState(false)
  const [saveCoinForm] = Form.useForm()
  const [folderList, setFolderList] = useState<FolderData[]>([])
  const [coinList, setCoinList] = useState<CoinInfo[]>([])
  const [saveLoading, setSaveLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<{ coinType: string, amount: number }[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  const getFolderList = async (folderIds: string[]) => {
    const folderList = await GetFolderListApi(folderIds)
    if (folderList) {
      setFolderList(folderList)
    }
  }
  const handleSaveCoin = async (values: { amount: number, coinType: string }) => {
    if (!account || !currentFolderId.current) {
      return
    }
    setSaveLoading(true)
    const tx = new Transaction()
    // 合并coin
    const coinObjectIds = []
    let cursor = null
    do {
      const objectListResponse = await client.getCoins({
        owner: account.address,
        coinType: values.coinType,
        cursor: cursor,
        limit: 100
      })

      const objectList = objectListResponse.data
      coinObjectIds.push(...objectList.map(item => item.coinObjectId))

      if (objectListResponse.hasNextPage) { cursor = objectListResponse.nextCursor } else { cursor = null }
      if (coinObjectIds.length >= 500) { cursor = null }
    } while (cursor)

    let mergedCoinObjectId = coinObjectIds[0]; // 默认使用第一个coin
    if ((values.coinType !== '0x2::sui::SUI' && coinObjectIds.length >= 2) || (values.coinType === '0x2::sui::SUI' && coinObjectIds.length >= 3)) {
      if (values.coinType === '0x2::sui::SUI') { 
        coinObjectIds.shift() 
      }

      const firstObjectId = coinObjectIds.shift()
      const remainingObjectIds = coinObjectIds.map(id => tx.object(id))

      if (firstObjectId != null && remainingObjectIds.length > 0) {
        // 保存合并后的coin引用
        mergedCoinObjectId = firstObjectId;
        tx.mergeCoins(tx.object(firstObjectId), remainingObjectIds)
      }
    }

    // 使用合并后的coin进行分割
    const splitResult = tx.splitCoins(tx.object(mergedCoinObjectId), [tx.pure.u64(values.amount)])

    // 存入文件夹 add_coin_to_folder
    tx.moveCall({
      target: `${packageId}::week_two::add_coin_to_folder`,
      arguments: [tx.object(currentFolderId.current), tx.object(splitResult)],
      typeArguments: [values.coinType]
    })



    mutate(
      {
        transaction: tx,
      },
      {
        onSuccess: async (result) => {
          await client.waitForTransaction({ digest: result.digest })
          messageApi.success('存入成功')
          setSaveCoinModalVisible(false)
          getAllBalances()
          setSaveLoading(false)
        },
        onError: (error) => {
          console.error(error)
          messageApi.error('存入失败')
          setSaveLoading(false)
        }
      }
    )
  }
  /**
   * 获取用户信息
   */
  const getUserProfile = async () => {
    console.log(account)
    if (!account?.address) {
      return
    }
    const profile = await GetCurrentUserProfileApi(`${packageId}::week_two::Profile`, account?.address || '')
    setProfile(profile)
    if (!profile) {
      navigate('/')
      return
    }
    getFolderList(profile.folders)
  }

  const openCreateFolder = () => {
    folderForm.resetFields()
    setFolderModalVisible(true)
  }

  const handleCreateFolder = async (values: { name: string; description: string }) => {
    if (!profile) {
      return
    }
    setFolderLoading(true)
    const txb = new Transaction()
    txb.moveCall({
      target: `${packageId}::week_two::create_folder`,
      arguments: [
        txb.pure.string(values.name),
        txb.pure.string(values.description),
        txb.object(profile.id),
      ],
    })
    mutate(
      {
        transaction: txb,
      },
      {
        onSuccess: async (result) => {
          await client.waitForTransaction({ digest: result.digest })
          folderForm.resetFields()
          setFolderModalVisible(false)
          getUserProfile()
          messageApi.success('创建文件夹成功')
        },
        onError: (error) => {
          setFolderLoading(false)
          console.error(error)
          messageApi.error('创建文件夹失败')
        },
      }
    )
  }

  const openSaveCoinModal = async (folderId: string) => {
    console.log(folderId)
    currentFolderId.current = folderId
    saveCoinForm.resetFields()
    setSaveCoinModalVisible(true)
  }

  const getAllBalances = async () => {
    setCoinList([])
    if (account?.address != null) {
      const updatedCoinList: CoinInfo[] = []
      try {
        const allBalances = await client.getAllBalances({ owner: account?.address })

        for (const coin of allBalances) {
          const coinMetadata = await client.getCoinMetadata({ coinType: coin.coinType })

          if (coinMetadata != null) {
            const humanBalance = parseFloat(coin.totalBalance) / Math.pow(10, coinMetadata.decimals)

            const coinInfo: CoinInfo = {
              symbol: coinMetadata.symbol,
              coinObjectCount: coin.coinObjectCount,
              coinType: coin.coinType,
              name: coinMetadata.name,
              humanBalance: humanBalance
            }

            updatedCoinList.push(coinInfo)
          }
        }
        setCoinList(updatedCoinList)
      } catch (error) {
        console.error('Error fetching coin list:', error)
      }
    }
  }

  const getFolderDetail = async (folderId: string) => {
    setDetailData([])
    setDetailModalVisible(true)
    setDetailLoading(true)
    const res = await GetFolderCoinListApi(folderId).finally(() => {
      setDetailLoading(false)
    })
    if (res) {
      setDetailData(res)
    }
  }

  useEffect(() => {
    getAllBalances()
    getUserProfile()
  }, [account?.address])

  return (
    <div className="container mx-auto px-4 py-8">
      <ConnectButton />
      {contextHolder}
      <Modal
        title="创建文件夹"
        open={folderModalVisible}
        onCancel={() => setFolderModalVisible(false)}
        footer={null}
      >
        <Form
          form={folderForm}
          layout="vertical"
          onFinish={handleCreateFolder}
          className="mt-4"
        >
          <Form.Item
            label="文件夹名称"
            name="name"
            rules={[{ required: true, message: '请输入文件夹名称' }]}
          >
            <Input placeholder="请输入文件夹名称" />
          </Form.Item>
          <Form.Item
            label="文件夹描述"
            name="description"
            rules={[{ required: true, message: '请输入文件夹描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入文件夹描述" />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <Button type="default" onClick={() => setFolderModalVisible(false)} className="mr-2">
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={folderLoading}>
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="存入"
        open={saveCoinModalVisible}
        onOk={() => saveCoinForm.submit()}
        onCancel={() => setSaveCoinModalVisible(false)}
        loading={saveLoading}
      >
        <Form form={saveCoinForm} layout="vertical" onFinish={handleSaveCoin} className="mt-4">
          <Form.Item
            label="存入数量"
            name="amount"
            rules={[{ required: true, message: '请输入存入数量' }]}
          >
            <InputNumber className="w-full" min={0}  />
          </Form.Item>
          <Form.Item
            label="存入币种"
            name="coinType"
            rules={[{ required: true, message: '请选择存入币种' }]}
          >
            <Select
              options={coinList.map((coin) => ({ label: `${coin.symbol} (${coin.name}): ${coin.humanBalance} (${coin.coinObjectCount} objects)`, value: coin.coinType }))}
              onChange={(value) => {
                saveCoinForm.setFieldValue('coinType', value)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 详情弹框 */}
      <Modal
        width={800}
        title="详情"
        open={detailModalVisible}
        onOk={() => setDetailModalVisible(false)}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        <Table
          rowKey="coinType"
          columns={[
            {
              title: '币种',
              dataIndex: 'coinType',
              key: 'coinType',
            },
            {
              title: '数量',
              dataIndex: 'amount',
              key: 'amount',
            },
          ]}
          dataSource={detailData}
          pagination={false}
          loading={detailLoading}
        />
      </Modal>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧用户信息Card */}
        <div className="w-full md:w-1/3">
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            title="用户信息"
            bordered={false}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-500">用户名</h3>
                <p className="text-2xl font-bold text-gray-800">{profile?.name || '未设置'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">描述</h3>
                <p className="text-gray-800">{profile?.description || '未设置'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧文件夹Card */}
        <div className="w-full md:w-2/3">
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            title="文件夹"
            bordered={false}
            extra={<Button onClick={openCreateFolder}>创建文件夹</Button>}
          >
            {
              folderList.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  暂无文件夹
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folderList.map((folder) => (
                    <div 
                      className="p-4 rounded-lg bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" 
                      key={folder.id}
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{folder.name}</h3>
                      <p className="text-gray-600">{folder.description}</p>
                      <div className="flex justify-between">
                        <Button type="primary" onClick={() => getFolderDetail(folder.id)}>详情</Button>
                        <Button type="primary" onClick={() => openSaveCoinModal(folder.id)}>存入</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </Card>
        </div>
      </div>
    </div>
  )
}
