'use client';

import { Twitter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiagnosisResult } from '@/types/diagnosis';
import { generateShareText } from '@/utils/generate-share-text';
import { toPng } from 'html-to-image';

interface Props {
  result: DiagnosisResult;
  resultCardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButtons({ result, resultCardRef }: Props) {
  const shareText = generateShareText(result);
  const encodedText = encodeURIComponent(shareText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

  const handleDownload = async () => {
    if (!resultCardRef.current) return;
    try {
      // 2回キャプチャすることでSVG（レーダーチャート）の描画ズレを防ぐ
      await toPng(resultCardRef.current, { backgroundColor: '#020d18', pixelRatio: 2 });
      const dataUrl = await toPng(resultCardRef.current, { backgroundColor: '#020d18', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = '市場価値診断結果.png';
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('画像保存に失敗しました', e);
      alert('画像の保存に失敗しました。スクリーンショットをお使いください。');
    }
  };

  return (
    <div className="flex gap-3 justify-center mt-4">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white gap-2">
          <Twitter size={16} />
          Xでシェア
        </Button>
      </a>
      <Button
        onClick={handleDownload}
        variant="outline"
        className="border-cyan-500 text-cyan-400 hover:bg-cyan-950 gap-2"
      >
        <Download size={16} />
        画像保存
      </Button>
    </div>
  );
}
