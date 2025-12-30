'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack } from '@/components/ui/Stack';
import { Page } from '@/components/ui/Page';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ログイン情報:', { email, password });
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
                <TextField
                  label="メールアドレス"
                  icon="mail"
                  type="email"
                  value={email}
                  placeholder="example@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="パスワード"
                  icon="lock"
                  type="password"
                  value={password}
                  placeholder="パスワードを入力"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  color="primary"
                  size="default"
                  width="full"
                >
                  ログイン
                </Button>
              </BlockStack>
            </form>

            <BlockStack gap="sm" alignItems="center">
              <Typography variant="small" color="muted">
                デモ用：任意のメールアドレスとパスワードでログインできます
              </Typography>
            </BlockStack>
          </BlockStack>
        </Card>
      </Container>
    </Page>
  );
};
