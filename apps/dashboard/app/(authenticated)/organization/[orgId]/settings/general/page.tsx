'use client';

import { FormSkeleton } from '@/components/loading-states';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { organization, useActiveOrganization } from '@packages/auth/client';
import { Button } from '@packages/base/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@packages/base/components/ui/card';
import { Input } from '@packages/base/components/ui/input';
import { Label } from '@packages/base/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Header } from '../../../../components/header';

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { data: activeOrg, isPending } = useActiveOrganization();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (activeOrg) {
      setName(activeOrg.name);
      setSlug(activeOrg.slug || '');
    }
  }, [activeOrg]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await organization.update({
        organizationId: activeOrg.id,
        data: {
          name,
          slug: slug || undefined,
        },
      });
      toast.success('Organization updated successfully');
      setSuccess('Organization updated successfully');
      router.refresh();
    } catch (err) {
      const errorMessage = 'Failed to update organization. Please try again.';
      setError(errorMessage);
      handleError(err, { fallbackMessage: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeOrg) return;

    const confirmed = confirm(
      'Are you sure you want to delete this organization? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError('');

    try {
      await organization.delete({
        organizationId: activeOrg.id,
      });
      toast.success('Organization deleted successfully');
      router.push('/');
      router.refresh();
    } catch (err) {
      const errorMessage = 'Failed to delete organization. Please try again.';
      setError(errorMessage);
      handleError(err, { fallbackMessage: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <>
        <Header pages={['Organization']} page="Settings" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="font-bold text-2xl tracking-tight">
                General Settings
              </h2>
              <p className="text-muted-foreground">
                Manage your organization's basic information.
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Update your organization's name and URL slug.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormSkeleton />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!activeOrg) {
    return <div>No active organization</div>;
  }

  return (
    <>
      <Header pages={['Organization']} page="Settings" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h2 className="font-bold text-2xl tracking-tight">
              Organization Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your organization's settings and configuration.
            </p>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Update your organization's name and URL slug.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Organization Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-muted-foreground text-sm">
                      Used in URLs and must be unique.
                    </p>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}
                  {success && (
                    <p className="text-green-600 text-sm">{success}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground text-sm">
                  Once you delete an organization, there is no going back.
                  Please be certain.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete Organization
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
