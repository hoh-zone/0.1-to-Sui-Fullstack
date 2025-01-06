import { SuiClient } from '@mysten/sui/client';

export const TestClient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443',
});

export const ImageNFT = [
    {
      id: 'john-von-neumann',
      title: 'John von Neumann',
      description: 'A mathematician and physicist known for game theory and computer science.',
      url: 'https://pic.imgdb.cn/item/6756fd88d0e0a243d4e0b50d.webp',
      onjectid: '0x01e4771681a76d9d500fed8b5f28ee23a4db89dbe07ac5aac655ee287223ae0d'
    },
    {
      id: 'isaac-newton',
      title: 'Isaac Newton',
      description: 'A physicist and mathematician who developed the laws of motion.',
      url: 'https://pic.imgdb.cn/item/6756fd87d0e0a243d4e0b50c.webp',
      onjectid: '0x7d267abc0ab1b75ced98f8f86cd11b1fd7cceb5bd20accd48b9ae7120c47986d'
    },
    {
      id: 'victor-hugo',
      title: 'Victor Hugo',
      description: 'A French poet and novelist best known for Les Misérables.',
      url: 'https://pic.imgdb.cn/item/6756fd87d0e0a243d4e0b50b.webp',
      onjectid: '0x8cd1b1a79d549f1468e5a655d10af397def67009a47102c3fc0ec681d015e4c4'
    },
    {
      id: 'thomas-edison',
      title: 'Thomas Edison',
      description: 'An inventor and businessman known for the light bulb and phonograph.',
      url: 'https://pic.imgdb.cn/item/6756fd76d0e0a243d4e0b506.webp',
      onjectid: '0xf4ece67c85450fb385d1e1a70672f71289aa603f008b2250a1c12bcb5010d8ec'
    },
    {
      id: 'leonardo-da-vinci',
      title: 'Leonardo da Vinci',
      description: 'An Italian artist, scientist, and polymath known for his paintings and inventions.',
      url: 'https://pic.imgdb.cn/item/6756fd75d0e0a243d4e0b505.webp',
      onjectid: '0x04585903bd04395b86294bda0cc3870ad4bbe0d7cc66c8a67144583968843f8a'
    },
    {
      id: 'sigmund-freud',
      title: 'Sigmund Freud',
      description: 'An Austrian neurologist and the founder of psychoanalysis.',
      url: 'https://pic.imgdb.cn/item/6756fd74d0e0a243d4e0b504.webp',
      onjectid: '0x76a84084be8975a5582aea7e53a87dd13a580a7699f204a7ee5e3806d6b0c793'
    },
    {
      id: 'alexander-the-great',
      title: 'Alexander the Great',
      description: 'A Macedonian king known for his military conquests and the spread of Hellenistic culture.',
      url: 'https://pic.imgdb.cn/item/6756fd73d0e0a243d4e0b503.webp',
      onjectid: '0x1d258a5b624a53f317e22e23fae4ad8cc7a9409ba431e949507abf913207cd81'
    },
    {
      id: 'adam-smith',
      title: 'Adam Smith',
      description: 'A Scottish economist and philosopher known for his work on the division of labor.',
      url: 'https://pic.imgdb.cn/item/6756fd73d0e0a243d4e0b502.webp',
      onjectid: '0x2340295736de6323a95db0890e8358572c94163aa8d8bc8cc7d6490f653d8ef9'
    },
];