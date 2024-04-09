/**
 * @jest-environment jsdom
 */
import {render, screen} from '@testing-library/react';
import AdminNav from '@/app/ui/admin/adminNav';

it('admin nav renders with proper selected nav', () => {
  render(<AdminNav />);

  const dashboardLink = screen.getByRole('link', {
    name: 'Dashboard',
  });

  expect(dashboardLink).toHaveClass('hover:text-red-300');
});
