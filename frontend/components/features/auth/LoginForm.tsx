'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack } from '@/components/ui/Stack';
import { Page } from '@/components/ui/Page';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { Notification } from '@/components/ui/Notification';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginAction(email, password);

      // result が undefined の場合は redirect() が成功した状態
      if (result && !result.success) {
        setError(result.error || 'ログインに失敗しました');
        setIsLoading(false);
      }
      // result が undefined またはリダイレクトされた場合は、
      // ブラウザが自動的にページ遷移するため setIsLoading は実行されない
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Page gradientBg="primary" centered>
      <Container maxWidth="md">
        <Card padding="lg" rounded="xl">
          <BlockStack gap="lg">
            <BlockStack gap="md" alignItems="center">
              <IconBadge icon="lock" color="primary" size="lg" />
              <Typography variant="h2" align="center">
                会計アプリ
              </Typography>
              <Typography color="secondary" align="center">
                個人事業主向け会計管理システム
              </Typography>
            </BlockStack>

            <form onSubmit={handleSubmit}>
              <BlockStack gap="md">
                {error && (
                  <Notification
                    type="error"
                    title="ログインに失敗しました"
                    description="メールアドレスまたはパスワードが違います。"
                    withBackground={true}
                  />
                )}

                <TextField
                  label="メールアドレス"
                  icon="mail"
                  type="email"
                  value={email}
                  placeholder="example@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  label="パスワード"
                  icon="lock"
                  type="password"
                  value={password}
                  placeholder="パスワードを入力"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  color="primary"
                  size="default"
                  width="full"
                  disabled={isLoading}
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </Button>
              </BlockStack>
            </form>
          </BlockStack>
        </Card>
      </Container>
    </Page>
  );
};
