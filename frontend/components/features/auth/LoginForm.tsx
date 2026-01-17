'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { loginFormSchema, type LoginFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack } from '@/components/ui/Stack';
import { Page } from '@/components/ui/Page';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import { Notification } from '@/components/ui/Notification';
import { Spinner } from '@/components/ui/Spinner';

export const LoginForm = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    setIsLoading(true);

    try {
      // クライアント側でログインをAPI呼び出し
      const result = await login(data.email, data.password);

      if (!result.data) {
        setApiError(result.error || 'ログインに失敗しました');
        setIsLoading(false);
        return;
      }

      // トークンが保存されたので、ダッシュボードにリダイレクト
      router.push('/');
    } catch (err) {
      setApiError('エラーが発生しました');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Page gradientBg="primary" centered>
      {isLoading && <Spinner fullscreen size="lg" label="ログイン処理中..." />}
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <BlockStack gap="md">
                {apiError && (
                  <Notification
                    type="error"
                    title="ログインに失敗しました"
                    description={apiError}
                    withBackground={true}
                    onClose={() => setApiError('')}
                  />
                )}

                <div>
                  <TextField
                    label="メールアドレス"
                    icon="mail"
                    type="email"
                    placeholder="example@email.com"
                    disabled={isLoading}
                    errorMessage={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div>
                  <TextField
                    label="パスワード"
                    icon="lock"
                    type="password"
                    placeholder="パスワードを入力"
                    disabled={isLoading}
                    errorMessage={errors.password?.message}
                    {...register('password')}
                  />
                </div>

                <Button
                  type="submit"
                  color="primary"
                  size="default"
                  width="full"
                  disabled={isLoading}
                >
                  ログイン
                </Button>
              </BlockStack>
            </form>
          </BlockStack>
        </Card>
      </Container>
    </Page>
  );
};
