/**
 * @jest-environment jsdom
 */
import {render, screen} from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('renders not found text', () => {
    render(<NotFound />);

    const notFoundText = screen.getByRole('heading', {
      name: /opps,/i,
    });

    expect(notFoundText).toBeInTheDocument();
  });
});
