export default function ProposalDetailPage({ params }: { params: { id: string } }) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold">Proposal #{params.id}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          I will leave this placeholder for you to add real information later.
        </p>
      </div>
    );
  }